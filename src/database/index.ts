import { connect } from 'mongoose';

export function createConnection(): void {
  try {
    connect('mongodb://localhost:27017/bins', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }
}

createConnection();