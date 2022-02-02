import { ChannelUser } from 'domain/entities/ChannelUser';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ChannelDb } from './ChannelDb';
import { UserDb } from './UserDb';
import { DbEntity } from '../common/DbEntity';
import { CHANNEL_USER_SCHEMA } from '../schemas/ChannelUserSchema';

@Entity(CHANNEL_USER_SCHEMA.TABLE_NAME)
export class ChannelUserDb extends DbEntity<ChannelUser> {
    constructor() {
        super(ChannelUser);
    }

    @Column('uuid', { name: CHANNEL_USER_SCHEMA.COLUMNS.USER_ID })
    @Index()
    userId: string;

    @Column('uuid', { name: CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID })
    @Index()
    channelId: string;

    /* Relationship */

    @ManyToOne(() => UserDb, user => user.channelUsers, { createForeignKeyConstraints: false })
    @JoinColumn({ name: CHANNEL_USER_SCHEMA.COLUMNS.USER_ID })
    user?: UserDb;

    @ManyToOne(() => ChannelDb, channel => channel.channelUsers)
    @JoinColumn({ name: CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID })
    channel?: ChannelDb;

    /* Handlers */

    override toEntity(): ChannelUser {
        const entity = super.toEntity();
        entity.userId = this.userId;
        entity.channelId = this.channelId;

        /* Relationship */

        if (this.user)
            entity.user = this.user.toEntity();

        if (this.channel)
            entity.channel = this.channel.toEntity();

        return entity;
    }

    override fromEntity(entity: ChannelUser): void {
        super.fromEntity(entity);
        this.userId = entity.userId;
        this.channelId = entity.channelId;
    }
}
