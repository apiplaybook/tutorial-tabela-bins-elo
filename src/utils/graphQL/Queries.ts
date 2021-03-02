export const CLIENT_BIN = `
  query OneBin($bin: String!) {
    bin(number: $bin) {
      issuer {
        name
      }

      product {
        name
      }

      allowedCaptures {
        name
        code
      }

      usages {
        name
        code
      }

      services {
        name
        isExchangeableOffer
      }
    }
  }
` 