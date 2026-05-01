import { Legend, Pie, PieChart } from 'recharts';

// #region Sample data
const data = [
    { name: 'Correct', value: 8, fill: 'green' },
    { name: 'Incorrect', value: 2, fill: 'red' },
];

// #endregion
const MyPie = () => (
    <Pie className='test' data={data} dataKey="value" nameKey="name" outerRadius="60%" innerRadius="50%" isAnimationActive={true} />
);

export default function ChartResults() {
    return (
        <div className='max-w-fit flex'>
            <PieChart className='max-w-[200px] h-auto'>
                <Legend iconSize={10} layout="vertical" verticalAlign="bottom" align={'center'} />
                {/* <MyPie /> */}
                <Pie className='test' data={data} dataKey="value" nameKey="name" outerRadius="60%" innerRadius="50%" isAnimationActive={true} />

            </PieChart>
        </div>
    )
}