import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}

  getHello(): string {
    return this.getDbStatus();
  }

  getDbStatus(): string {
    return this.connection.isConnected ? 'Connected' : 'Disconnected';
  }
}
