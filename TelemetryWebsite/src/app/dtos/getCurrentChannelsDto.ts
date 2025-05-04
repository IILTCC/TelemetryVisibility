export class GetCurrentChannelsDto {
    public readonly channelsCurrent: { [key: string]: ChannelCurrent };
    constructor(channelsCurrent: { [key: string]: ChannelCurrent }) {
        this.channelsCurrent = channelsCurrent;
    }
}
export class ChannelCurrent {
    public id: number;
    public delay: number;
    public error: number;
    constructor(id: number, delay: number, error: number) {
        this.id = id;
        this.delay = delay;
        this.error = error;
    }
}