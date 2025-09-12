import { Survey_Data } from "../model/SurveyModel";
import { SurveyType } from "../validations/SurveyAuth";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";

const getSurveyService = async () => {
  const surveyList = await Survey_Data.find();
  try {
    if (surveyList.length === 0) {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.surveyNotFound,
      };
    } else {
      return {
        surveyList,
        count: surveyList.length,
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

const getSurveyByIdService = async (id: string) => {
  const survey = await Survey_Data.findOne({ id });
  try {
    if (!survey) {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.surveyNotFound,
      };
    } else {
      return {
        statusCode: responseStatusCode.success,
        message: translations.surveyFound,
        data: survey,
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

const postSurveyService = async (surveyData: SurveyType) => {
  const survey = await Survey_Data.create(surveyData);

  try {
    if (survey) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.surveyCreated,
        data: survey,
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

const updateSurveyService = async (id: string, surveyData: SurveyType) => {
  try {
    const survey = await Survey_Data.findOneAndUpdate({ id }, surveyData, {
      new: true,
      runValidators: true,
    });
    if (survey) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.surveyUpdated,
        data: survey,
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

const deleteSurveyService = async (id: string) => {
  try {
    const survey = await Survey_Data.findOneAndDelete({ id });
    if (survey) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.surveyDeleted,
      };
    } else {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.surveyNotFound,
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

const updateSurveyStatusService = async (id: string, isActive: boolean) => {
  try {
    const survey = await Survey_Data.findOneAndUpdate(
      { id },
      { isActive },
      { new: true }
    );
    if (survey) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.surveyUpdated,
        data: survey,
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

export {
  getSurveyService,
  getSurveyByIdService,
  postSurveyService,
  updateSurveyService,
  deleteSurveyService,
  updateSurveyStatusService,
};
