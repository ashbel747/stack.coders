import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "ACCESS GRANTED(200). Wait, how did you get this far🫡? Anyways, Happy Hacking🎭"
  }
}
