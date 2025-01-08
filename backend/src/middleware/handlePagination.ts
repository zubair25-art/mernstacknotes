import  { RequestHandler } from "express";

const handlePagination: RequestHandler = (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = 6; 

    if (page < 1) {
      throw new Error("Invalid page number. Must be a positive integer.");
    }

    req.query.page = page.toString();
    req.query.limit = limit.toString();

    next(); 
  } catch (error) {
    next(error); 
  }
};

export default handlePagination;
