import React, {useEffect, useState, useMemo} from 'react';
import { AreaChart, Area,CartesianGrid, ResponsiveContainer, XAxis, YAxis, Text } from 'recharts';

export default function BarChartComponent({data, dataKey, color}){
    const [yRange, setYRange] = useState([]);
    const densities = data.map((i) => i[dataKey]);
    const [min, max] = [Math.min(...densities), Math.max(...densities)];

    useEffect(() => {
        if (!yRange.length){
            setYRange([min, max])
        }
    }, [JSON.stringify(data)])
    const tickFormatter = f => Math.round(f*100)/100
    return (
      <ResponsiveContainer width="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
            <CartesianGrid horizontal={false}/>
          <XAxis dataKey="value" tickCount={5} padding={0} minTickGap={1} tickFormatter={tickFormatter}/>
          <YAxis dataKey="density" domain={yRange} ticks={false} hide/>
          <defs>
            <linearGradient 
                id={`splitColor${color}`}
                x1="0" 
                y1="0" 
                x2="0"
                y2={`50px`}
                >
              <stop offset={yRange[0]} stopColor={color} />
              <stop offset={yRange[1]} stopColor={'gray'} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={dataKey} stroke="#000" fill={`url(#splitColor${color})`} />
        </AreaChart>
      </ResponsiveContainer>
    );
}