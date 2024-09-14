import { Request, Response } from "express";

export async function checkHealth(request: Request, 
                                 response: Response): Promise<void> {
    response.status(200).json();
}

