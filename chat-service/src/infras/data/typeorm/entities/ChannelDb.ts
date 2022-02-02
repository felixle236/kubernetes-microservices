import { Channel } from 'domain/entities/Channel';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChannelUserDb } from './ChannelUserDb';
import { MessageDb } from './MessageDb';
import { UserDb } from './UserDb';
import { DbEntity } from '../common/DbEntity';
import { CHANNEL_SCHEMA } from '../schemas/ChannelSchema';

@Entity(CHANNEL_SCHEMA.TABLE_NAME)
export class ChannelDb extends DbEntity<Channel> {
    constructor() {
        super(Channel);
    }

    @Column('varchar', { name: CHANNEL_SCHEMA.COLUMNS.LAST_MESSAGE, length: 500, nullable: true })
    lastMessage?: string;

    @Column('uuid', { name: CHANNEL_SCHEMA.COLUMNS.LAST_SENDER_ID, nullable: true })
    lastSenderId?: string;

    /* Relationship */

    @ManyToOne(() => UserDb, user => user.channels, { createForeignKeyConstraints: false })
    @JoinColumn({ name: CHANNEL_SCHEMA.COLUMNS.LAST_SENDER_ID })
    lastSender?: UserDb;

    @OneToMany(() => ChannelUserDb, channelUser => channelUser.channel)
    channelUsers?: ChannelUserDb[];

    @OneToMany(() => MessageDb, message => message.channel)
    messages?: MessageDb[];

    /* Handlers */

    override toEntity(): Channel {
        const entity = super.toEntity();
        entity.lastMessage = this.lastMessage;
        entity.lastSenderId = this.lastSenderId;

        /* Relationship */

        if (this.lastSender)
            entity.lastSender = this.lastSender.toEntity();

        if (this.channelUsers)
            entity.channelUsers = this.channelUsers.map(channelUser => channelUser.toEntity());

        if (this.messages)
            entity.messages = this.messages.map(message => message.toEntity());

        return entity;
    }

    override fromEntity(entity: Channel): void {
        super.fromEntity(entity);
        this.lastMessage = entity.lastMessage;
        this.lastSenderId = entity.lastSenderId;
    }
}
