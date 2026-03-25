import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Get out of here, this is not the API you are looking for!';
  }
}
