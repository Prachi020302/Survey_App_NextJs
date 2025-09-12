import { NextRequest, NextResponse } from "next/server";
import {
  deleteSurveyService,
  getSurveyByIdService,
  getSurveyService,
  postSurveyService,
  updateSurveyService,
} from "../services/SurveyService";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";

const getSurveyList = async () => {
  try {
    const survey = await getSurveyService();
    return NextResponse.json({
      statusCode: survey.statusCode,
      message: survey.message,
      data: survey.data,
      count: survey.count,
    });
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json({
      statusCode: 500,
      message: typeError.message || translations.internalError,
    });
  }
};

const getSurveyById = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const survey = await getSurveyByIdService(id);
    if (survey) {
      return NextResponse.json({
        statusCode: survey.statusCode,
        message: survey.message,
        data: survey.data,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.notFound,
        message: translations.surveyNotFound,
      });
    }
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json({
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    });
  }
};

const createSurvey = async (req: NextRequest) => {
  const { title, questions } = await req.json();
  let count = true;
  if (!title) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.titleRequired,
    });
  }
  if (!questions || questions.length === 0) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.questionRequired,
    });
  } else {
    try {
      if (count) {
        const surveyData = { title, questions, isActive: true };
        const survey = await postSurveyService(surveyData);
        if (survey) {
          return NextResponse.json({
            statusCode: survey.statusCode,
            message: survey.message,
            data: survey.data,
          });
        } else {
          return NextResponse.json({
            statusCode: responseStatusCode.failure,
            message: translations.surveyCreationFailed,
          });
        }
      }
    } catch (error) {
      return NextResponse.json({
        statusCode: responseStatusCode.internal,
        message: translations.internalError,
        error: error,
      });
    }
  }
};

const updateSurvey = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { title, questions } = await req.json();
  let count = true;
  if (!title) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.titleRequired,
    });
  }
  if (!questions || questions.length === 0) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.questionRequired,
    });
  } else {
    try {
      if (count) {
        const surveyData = { title, questions, isActive: true };
        const survey = await updateSurveyService(id, surveyData);
        if (survey) {
          return NextResponse.json({
            statusCode: survey.statusCode,
            message: survey.message,
            data: survey.data,
          });
        } else {
          return NextResponse.json({
            statusCode: responseStatusCode.failure,
            message: translations.surveyUpdateFailed,
          });
        }
      }
    } catch (error) {
      return NextResponse.json({
        statusCode: responseStatusCode.internal,
        message: translations.internalError,
        error: error,
      });
    }
  }
};

const deleteSurvey = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const survey = await deleteSurveyService(id);
    if (survey) {
      return NextResponse.json({
        statusCode: responseStatusCode.success,
        message: translations.surveyDeleted,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.failure,
        message: translations.surveyDeletionFailed,
      });
    }
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json({
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    });
  }
};

export {
  getSurveyList,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
};
