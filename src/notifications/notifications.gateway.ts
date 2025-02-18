import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers: Set<string> = new Set();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.activeUsers.add(client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);
  }

  sendNotification(event: string, message: any) {
    this.server.emit(event, message);
  }

  @SubscribeMessage('client_message')
  handleClientMessage(@MessageBody() data: { message: string }) {
    console.log('Received from client:', data.message);
    this.server.emit('server_message', { message: `Server received: ${data.message}` });
  }
}
