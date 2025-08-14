import mongoose from "mongoose";

const FinancialHealthQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FinancialHealthQuestionModel =
  mongoose.models.financialhealthquestions ||
  mongoose.model("financialhealthquestions", FinancialHealthQuestionSchema);

export default FinancialHealthQuestionModel;
