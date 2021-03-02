import { api } from '../utils/graphQL/api'
import { CLIENT_BIN } from '../utils/graphQL/Queries'
import binRepository from '../repositories/BinRepository'

class CreateBinService {
  public async execute(numberBin: string) {
    if(!numberBin) {
      throw new Error('Preencha o campo BIN corretamente!"')
    }

    const binExists = await binRepository.findOne({ numberBin: numberBin })

    if (binExists) {
      throw new Error('BIN ja cadastrado na base!')
    }

    const eloCall = await api({
      query: CLIENT_BIN,
      variables: {
        bin: numberBin
      }
    })
  
    const eloResponse = await eloCall.json()
    

    if (!eloResponse.data.bin) {
      throw new Error('Numero do BIN invalido!')
    }


    const data = {
      numberBin,
      ...eloResponse.data.bin
    }
  
    const bin = await binRepository.create(data)

    return bin;
  }
}

export default CreateBinService