import { User } from 'domain/entities/User';
import { UserStatus } from 'domain/enums/UserStatus';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ChannelDb } from './ChannelDb';
import { ChannelUserDb } from './ChannelUserDb';
import { MessageDb } from './MessageDb';
import { DbEntity } from '../common/DbEntity';
import { USER_SCHEMA } from '../schemas/UserSchema';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends DbEntity<User> {
    constructor() {
        super(User);
    }

    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    roleId: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, nullable: true })
    lastName?: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.EMAIL })
    @Index({ unique: true, where: DbEntity.getIndexFilterDeletedColumn() })
    email: string;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.Actived })
    status: UserStatus;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.AVATAR, nullable: true })
    avatar?: string;

    /* Relationship */

    @OneToMany(() => ChannelDb, channel => channel.lastSender)
    channels: ChannelDb[];

    @OneToMany(() => ChannelUserDb, channelUser => channelUser.user)
    channelUsers: ChannelUserDb[];

    @OneToMany(() => MessageDb, message => message.sender)
    sendMessages: MessageDb[];

    @OneToMany(() => MessageDb, message => message.receiver)
    receiveMessages: MessageDb[];

    /* Handlers */

    override toEntity(): User {
        const entity = super.toEntity();

        entity.roleId = this.roleId;
        entity.firstName = this.firstName;
        entity.lastName = this.lastName;
        entity.email = this.email;
        entity.status = this.status;
        entity.avatar = this.avatar;

        /* Relationship */

        if (this.channels)
            entity.channels = this.channels.map(channel => channel.toEntity());

        if (this.channelUsers)
            entity.channelUsers = this.channelUsers.map(channelUser => channelUser.toEntity());

        if (this.sendMessages)
            entity.sendMessages = this.sendMessages.map(sendMessage => sendMessage.toEntity());

        if (this.receiveMessages)
            entity.receiveMessages = this.receiveMessages.map(receiveMessage => receiveMessage.toEntity());

        return entity;
    }

    override fromEntity(entity: User): void {
        super.fromEntity(entity);

        this.roleId = entity.roleId;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.email = entity.email;
        this.status = entity.status;
        this.avatar = entity.avatar;
    }
}
