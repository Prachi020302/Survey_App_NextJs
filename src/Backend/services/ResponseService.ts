import { Response_Data } from "../model/ResponseModel";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";
import { ResponseType } from "../validations/ResponseAuth";

export const getResponseService = async () => {
  try {
    // First get all responses
    const responseList = await Response_Data.find();

    if (responseList.length === 0) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.responseList,
        data: [],
        count: 0,
      };
    }

    // Manually populate survey data using the custom id field
    const populatedResponses = await Promise.all(
      responseList.map(async (response) => {
        const { Survey_Data } = await import("../model/SurveyModel");
        const survey = await Survey_Data.findOne({ id: response.surveyId });
        return {
          ...response.toObject(),
          surveyId: survey
            ? {
                id: survey.id,
                title: survey.title,
                description: survey.description,
              }
            : null,
        };
      })
    );

    return {
      statusCode: responseStatusCode.success,
      message: translations.responseList,
      data: populatedResponses,
      count: populatedResponses.length,
    };
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export const getResponseByIdService = async (responseId: string) => {
  try {
    // Find the specific response by ID
    const response = await Response_Data.findOne({ responseId });

    if (!response) {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.responseNotFound,
      };
    }

    // Manually populate survey data using the custom id field
    const { Survey_Data } = await import("../model/SurveyModel");
    const survey = await Survey_Data.findOne({ id: response.surveyId });

    const populatedResponse = {
      ...response.toObject(),
      surveyId: survey
        ? {
            id: survey.id,
            title: survey.title,
            description: survey.description,
            questions: survey.questions, // Include questions to get labels
          }
        : null,
    };

    // If we have survey questions, map question labels to answers
    if (survey?.questions) {
      populatedResponse.answers = populatedResponse.answers.map(
        (answer: { questionId: string; selectedOptions: string[] }) => {
          const question = survey.questions.find(
            (q: { id: string; label?: string; type?: string }) =>
              q.id === answer.questionId
          );
          return {
            ...answer,
            questionLabel:
              question?.label || question?.type || "Unknown Question",
          };
        }
      );
    }

    return {
      statusCode: responseStatusCode.success,
      message: translations.responseFound,
      data: populatedResponse,
    };
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export const createResponseService = async (responseData: ResponseType) => {
  const response = await Response_Data.create(responseData);
  try {
    if (response) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.responseCreated,
        data: response,
      };
    }
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export const updateResponseService = async (
  id: string,
  responseData: ResponseType
) => {
  const response = await Response_Data.findOneAndUpdate({ id }, responseData, {
    new: true,
  });
  try {
    if (!response) {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.responseNotFound,
      };
    } else {
      return {
        statusCode: responseStatusCode.success,
        message: translations.responseUpdated,
        data: response,
      };
    }
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export const deleteResponseService = async (id: string) => {
  const response = await Response_Data.findOneAndDelete({ id });
  try {
    if (!response) {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.responseNotFound,
      };
    }
    return {
      statusCode: responseStatusCode.success,
      message: translations.responseDeleted,
    };
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export const getResponseByUserIdService = async (userId: string) => {
  try {
    // First get responses for the specific user
    const responseList = await Response_Data.find({ userId });

    if (responseList.length === 0) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.responseList,
        data: [],
        count: 0,
      };
    }

    // Manually populate survey data using the custom id field
    const populatedResponses = await Promise.all(
      responseList.map(async (response) => {
        const { Survey_Data } = await import("../model/SurveyModel");
        const survey = await Survey_Data.findOne({ id: response.surveyId });
        return {
          ...response.toObject(),
          surveyId: survey
            ? {
                id: survey.id,
                title: survey.title,
                description: survey.description,
              }
            : null,
        };
      })
    );

    return {
      statusCode: responseStatusCode.success,
      message: translations.responseList,
      data: populatedResponses,
      count: populatedResponses.length,
    };
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};
