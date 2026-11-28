const dateFormat = new Intl.DateTimeFormat('ja', {
    dateStyle: 'long',
    timeZone: 'UTC',
});

const LocalTime = ({ date }: { date: string }) => (
    <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
);

export default LocalTime;
