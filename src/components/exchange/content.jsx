import React from "react";

import Chart from "react-apexcharts";
import {useSelector} from "react-redux"


import {Tabs} from './tabs';
import { TablePart2 } from "./part/table2";
import {tradeOrdersSelector,tradeOrdersLoadedSeletor, orderBookSelector, orderBookLoadedSelector,priceChartLoadedSelector, priceChartSelector} from "../../store/selector";
import {chartOptions } from "../../utils/chart.config"
import { Spinner } from "./part/spinner";

const priceSymbol = (lastPriceChange) => {
	let output
	if(lastPriceChange === '+') {
		output = <span style={{color:'#22c55e'}}>&#9650;</span>
	} else {
		output = <span style={{color:'#E24056'}}>&#9660;</span>
	}
	return(output)
}

const showPriceChart = (priceChart) => {
	return(
		<div className="price-chart h-full">
			<div>
				<h4>DAPP/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
			</div>
			<Chart options={chartOptions} series={priceChart.series} type='candlestick' width='98%' height='90%' />
		</div>
	)
}

export const Content = () => {
  const tradeOrdersLoaded=useSelector(tradeOrdersLoadedSeletor);
  const tradeOrders=useSelector(tradeOrdersSelector)

  const orderBook=useSelector(orderBookSelector)
  const orderBookLoaded=useSelector(orderBookLoadedSelector)

  const priceChartLoaded=useSelector(priceChartLoadedSelector)
  const priceChart=useSelector(priceChartSelector)

  let buyOrders=[]
  let sellOrders=[]
  if(orderBookLoaded&&orderBook){
    buyOrders=orderBook.buyOrders
    sellOrders=orderBook.sellOrders
  }
    return (
      <div className=" grid grid-cols-12 h-full">
        <div className="col-span-9 h-full grid grid-rows-6 w-full">
            <div className="row-span-1  flex-col px-4 w-full">
                <select defaultValue="1" className="select select-bordered w-40 max-w-xs">
                  <option value="1">BTH-WJB</option>
                </select>
            </div>
            <div className="row-span-5 w-full justify-center items-center text-center">
              {priceChartLoaded?showPriceChart(priceChart):<Spinner />}
            </div>
        </div>
        <div className="col-span-3 bg-green-300">
            <Tabs type="1" tabs={[
                    {label:"订单簿",content:
                    <div>
                      <TablePart2 type="1"
                      loaded={orderBookLoaded} 
                      buyOrders={buyOrders}
                      sellOrders={sellOrders}
                        />
                    </div>
                  },
                    {label:"最近交易",content:
                    <div>
                      <TablePart2 
                      loaded={tradeOrdersLoaded} 
                      orders={tradeOrders}/>
                    </div> 
                    }]}></Tabs>
        </div>
      </div>
    );
  };