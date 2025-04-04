export class Consts {
    public static readonly SIMULATOR_URL = "http://localhost:5000/api/Bitstream/";
    public static readonly SIMULATOR_START = "startErrorSimulation";
    public static readonly SIMULATOR_STOP = "stopSimulator";
    public static readonly ARCHIVE_URL = "http://localhost:4999/api/FrameRequest/";
    public static readonly ARCHIVE_GET_FRAMES = "frameByIcd";
    public static readonly ARCHIVE_GET_FRAME_COUNT = "getFrameCount";
    public static readonly STATISTICS_URL = "http://localhost:4999/api/Statistics/";
    public static readonly STATISTICS_GET_STATISTICS = "getStatistics";
    public static readonly STATISTICS_GET_STATISTICS_COUNT = "getStatisticsCount";
    public static readonly SIGNALR_STATISTICS_NAME = 'updateStatistics';
    public static readonly SIGNALR_URL = 'http://localhost:4998/statistics';
}