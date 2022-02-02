import { Message } from 'domain/entities/Message';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ChannelDb } from './ChannelDb';
import { UserDb } from './UserDb';
import { DbEntity } from '../common/DbEntity';
import { MESSAGE_SCHEMA } from '../schemas/MessageSchema';

@Entity(MESSAGE_SCHEMA.TABLE_NAME)
@Index((messageDb: MessageDb) => [messageDb.channelId, messageDb.createdAt])
export class MessageDb extends DbEntity<Message> {
    constructor() {
        super(Message);
    }

    @Column('uuid', { name: MESSAGE_SCHEMA.COLUMNS.CHANNEL_ID })
    channelId: string;

    @Column('uuid', { name: MESSAGE_SCHEMA.COLUMNS.SENDER_ID })
    senderId: string;

    @Column('uuid', { name: MESSAGE_SCHEMA.COLUMNS.RECEIVER_ID })
    receiverId: string;

    @Column('varchar', { name: MESSAGE_SCHEMA.COLUMNS.CONTENT, length: 500 })
    content: string;

    /* Relationship */

    @ManyToOne(() => ChannelDb, channel => channel.messages)
    @JoinColumn({ name: MESSAGE_SCHEMA.COLUMNS.CHANNEL_ID })
    channel?: ChannelDb;

    @ManyToOne(() => UserDb, user => user.sendMessages, { createForeignKeyConstraints: false })
    @JoinColumn({ name: MESSAGE_SCHEMA.COLUMNS.SENDER_ID })
    sender?: UserDb;

    @ManyToOne(() => UserDb, user => user.receiveMessages, { createForeignKeyConstraints: false })
    @JoinColumn({ name: MESSAGE_SCHEMA.COLUMNS.RECEIVER_ID })
    receiver?: UserDb;

    /* Relationship */

    /* Handlers */

    override toEntity(): Message {
        const entity = super.toEntity();
        entity.channelId = this.channelId;
        entity.senderId = this.senderId;
        entity.receiverId = this.receiverId;
        entity.content = this.content;

        /* Relationship */

        if (this.channel)
            entity.channel = this.channel.toEntity();

        if (this.sender)
            entity.sender = this.sender.toEntity();

        if (this.receiver)
            entity.receiver = this.receiver.toEntity();

        return entity;
    }

    override fromEntity(entity: Message): void {
        super.fromEntity(entity);
        this.channelId = entity.channelId;
        this.senderId = entity.senderId;
        this.receiverId = entity.receiverId;
        this.content = entity.content;
    }
}
