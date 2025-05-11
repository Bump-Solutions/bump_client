import {
  formatTimestamp,
  isSameDay,
  isThisYear,
  now,
  yesterday,
} from "../../utils/functions";

interface MessageDateDividerProps {
  date: Date;
  detail?: string;
}

const months = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
];

const MessageDateDivider = ({
  date,
  detail = null,
}: MessageDateDividerProps) => {
  let formattedDate: string;

  if (isSameDay(date, now())) {
    formattedDate = "Ma";
  } else if (isSameDay(date, yesterday())) {
    formattedDate = "Tegnap";
  } else if (isThisYear(date, now())) {
    formattedDate = `${months[date.getMonth()]} ${date.getDate()}.`;
  } else {
    formattedDate = formatTimestamp(date, "YYYY.MM.DD");
  }

  return (
    <div className='date-divider'>
      <h3>{formattedDate}</h3>
      {detail && <p>{detail}</p>}
    </div>
  );
};

export default MessageDateDivider;
