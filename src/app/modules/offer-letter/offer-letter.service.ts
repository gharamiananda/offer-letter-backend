import QueryBuilder from "../../builder/QueryBuilder";
import { EmailHelper } from "../../utils/emailHelper";
import {
  generateOfferLetterPDF,
  generateOrderInvoicePDF,
} from "../../utils/generateOrderInvoicePDF";
import { IJwtPayload } from "../auth/auth.interface";
import { IOfferLetter, offerLetterStatus } from "./offer-letter.interface";
import OfferLetter from "./offer-letter.model";

export const offerLetterService = {
  async getOfferLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(OfferLetter.find(), query)
      .search(["name"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await offerLetterQuery.modelQuery;
    const meta = await offerLetterQuery.countTotal();

    return {
      meta,
      result,
    };
  },
  async createOfferLetter(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload
  ) {
    const updatedData: IOfferLetter = {
      ...offerLetterData,
    };

    if ((offerLetterData.status = offerLetterStatus.SENT)) {
      const emailContent = await EmailHelper.createEmailContent(
        //@ts-ignore
        { userName: offerLetterData.employeeEmail || "", ...updatedData },
        "offerLetter"
      );
      const pdfBuffer = await generateOfferLetterPDF(offerLetterData);

      const attachment = {
        filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,

        content: pdfBuffer,
        encoding: "base64", // if necessary
      };

      const result = await EmailHelper.sendEmail(
        //@ts-ignore
        offerLetterData.employeeEmail,
        emailContent,
        "Offer letter confirmed!",
        attachment
      );

      if (result.status === offerLetterStatus.SENT) {
        updatedData.status = offerLetterStatus.SENT;
      } else {
        updatedData.status = offerLetterStatus.FAILED;
      }
    }
    const newOfferLetter = new OfferLetter({
      ...updatedData,
      generateByUser: authUser.userId,
    });

    const result = await newOfferLetter.save();
    return result;
  },

  // async updateOfferLetter(
  //   productId: string,
  //   payload: Partial<IProduct>,
  //   productImages: IImageFiles,
  //   authUser: IJwtPayload
  // ) {
  //   const { images } = productImages;

  //   const user = await User.findById(authUser.userId);
  //   const shop = await Shop.findOne({ user: user?._id });
  //   const product = await Product.findOne({
  //     shop: shop?._id,
  //     _id: productId,
  //   });

  //   if (!user?.isActive) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, "User is not active");
  //   }
  //   if (!shop) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a shop");
  //   }
  //   if (!shop.isActive) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, "Your shop is inactive");
  //   }
  //   if (!product) {
  //     throw new AppError(StatusCodes.NOT_FOUND, "Product Not Found");
  //   }

  //   if (images && images.length > 0) {
  //     payload.imageUrls = images.map((image) => image.path);
  //   }

  //   return await Product.findByIdAndUpdate(productId, payload, { new: true });
  // },

  // async deleteOfferLetter(productId: string, authUser: IJwtPayload) {
  //   const user = await User.findById(authUser.userId);
  //   const shop = await Shop.findOne({ user: user?._id });
  //   const product = await Product.findOne({
  //     shop: shop?._id,
  //     _id: productId,
  //   });

  //   if (!user?.isActive) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, "User is not active");
  //   }
  //   if (!shop) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a shop");
  //   }
  //   if (!product) {
  //     throw new AppError(StatusCodes.NOT_FOUND, "Product Not Found");
  //   }

  //   return await Product.findByIdAndDelete(productId);
  // },
};
