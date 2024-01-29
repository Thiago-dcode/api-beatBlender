import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Transports } from "winston/lib/winston/transports/index.js";
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
type TransportKey = "daily" | "console" | "file";
const format = combine(
  timestamp({ format: timestampFormat }),

  printf(({ timestamp, level, message, ...data }) => {
    const response = {
      level,
      timestamp,
      message,
      data,
    };

    return JSON.stringify(response);
  })
);
const transportMap = {
  daily: new DailyRotateFile({
    // each file name includes current date
    filename: "logs/rotating-logs-%DATE%.log",
    datePattern: "MMMM-DD-YYYY",
    zippedArchive: false, // zip logs true/false
    maxSize: "20m", // rotate if file size exceeds 20 MB
    maxFiles: "14d", // max files
  }),
  console: new winston.transports.Console(),
  file: (filename = "logs/example.log") => {
    return new winston.transports.File({
      filename,
    });
  },
};
const _logger = winston.createLogger({
  // store logs in the console
});

const logger = {
  daily: winston.createLogger({ format, transports: [transportMap.daily] }),
  console: winston.createLogger({ format, transports: [transportMap.console] }),
  file: (filename = "logs/example.log") => {
    return winston.createLogger({
      format,
      transports: [transportMap.file(filename)],
    });
  },
  // custom: (drives:Array<TransportKey>)=>{

  //   return winston.createLogger({
  //     format,
  //     transports: drives.map(drive =>{
  //       const transport = transportMap[drive]
  //       if(transport instanceof  TransformStream){
  //         return transport
  //       }
  //       return transportMap['daily']
        
  //     }) ,
  //   });
    
  // }
};

export default logger;
