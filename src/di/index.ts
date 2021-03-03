import { container } from 'tsyringe'
import { YoutubeClient } from "@/api/youtubeClient";
import { YoutubeService } from "@/services/youtubeService";
import { LoggerService } from "@/services/loggerService";

container.register("IYoutubeClient", { useClass: YoutubeClient });
container.register("IYoutubeService", { useClass: YoutubeService });
container.register("ILoggerService", { useClass: LoggerService });

export { container as ApplicationContainer };