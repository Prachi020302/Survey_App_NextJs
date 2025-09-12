import { NextRequest, NextResponse } from "next/server";
import {
  createResponseService,
  deleteResponseService,
  getResponseByIdService,
  getResponseService,
  updateResponseService,
} from "../services/ResponseService";
import translations from "../utils/translate";
import { responseStatusCode } from "../utils/responseHandler";

const getResponse = async () => {
  try {
    const response = await getResponseService();
    return NextResponse.json({
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
      count: response.count,
    });
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json({
      statusCode: 500,
      message: typeError.message || translations.internalError,
    });
  }
};

const getResponseById = async (req: NextRequest) => {
  const { id } = await req.json();
  try {
    const response = await getResponseByIdService(id);
    if (response) {
      return NextResponse.json({
        statusCode: response.statusCode,
        message: response.message,
        data: response.data,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.notFound,
        message: translations.responseNotFound,
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

const createResponse = async (req: NextRequest) => {
  const responseData = await req.json();

  try {
    const response = await createResponseService(responseData);
    if (response) {
      return NextResponse.json({
        statusCode: response.statusCode,
        message: response.message,
        data: response.data,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.failure,
        message: translations.responseCreationFailed,
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

const updateResponse = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const responseData = await req.json();
  try {
    const response = await updateResponseService(id, responseData);
    if (response) {
      return NextResponse.json({
        statusCode: response.statusCode,
        message: response.message,
        data: response.data,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.failure,
        message: translations.responseUpdateFailed,
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

const deleteResponse = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const response = await deleteResponseService(id);
    if (response) {
      return NextResponse.json({
        statusCode: response.statusCode,
        message: translations.responseDeleted,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.failure,
        message: translations.responseDeletionFailed,
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
  getResponse,
  getResponseById,
  createResponse,
  updateResponse,
  deleteResponse,
};
