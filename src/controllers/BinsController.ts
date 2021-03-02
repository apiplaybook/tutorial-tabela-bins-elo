import { Request, Response } from "express";
import CreateBinService from "../services/CreateBinService";
import binRepository from '../repositories/BinRepository'

class BinsController {
  public async index(request: Request, response: Response) {
    try {
    const listBins = await binRepository.find()

    return response.render('index', {
      listBins: listBins,
      error: {}
    })
    } catch (error) {
      const listBins = await binRepository.find()

      return response.render('index', {
        listBins: listBins,
        error: error.message
      })
    }
  }

  public async store(request: Request, response: Response) {
    try {
      const { bin } = request.body;
      
      const createBin = new CreateBinService()

      await createBin.execute(bin)

      return response.redirect('/')
    } catch (error) {
      const listBins = await binRepository.find()

      return response.render('index', {
        listBins: listBins,
        error: error.message
      })
    }
  }
}

export default BinsController; 