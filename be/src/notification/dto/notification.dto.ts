import { InputType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationDto {
  @Field()
  _id: string;

  @Field()
  recipientDID: string;

  @Field()
  recipientWalletAddress: string;

  @Field()
  type: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  metadata?: string;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  readAt?: Date;

  @Field({ nullable: true })
  senderDID?: string;

  @Field({ nullable: true })
  senderWalletAddress?: string;

  @Field({ nullable: true })
  relatedEntityId?: string;

  @Field({ nullable: true })
  relatedEntityType?: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class MarkNotificationReadInput {
  @Field()
  notificationId: string;
}

@ObjectType()
export class MarkNotificationReadResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
