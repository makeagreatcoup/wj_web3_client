import React, { useState } from 'react';

export const Tabs=(props)=> {
  const [activeTab, setActiveTab] = useState(0);

  const type=props.type;//tab标签样式
  const mold=props.mold;//tab标签样式
  let tabClass="";
  let liClass="";
  if(type){
    tabClass="";
    liClass="";
  }

  return (
    <div className=" items-center bg-default  lg:h-full  ">
      <div className="rounded-md">
        <ul className={`inline-flex items-center  p-ssm rounded-md 
        ${type?'text-sm bg-gray-700':' bg-default row-span-1'}
        ${mold?'':'w-full  flex'}
        `}>
          {props.tabs.map((tab, index) => (
            <li
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-24  rounded-md text-white  py-2  transition-all duration-400 flex-1 items-center text-center justify-center 
              ${type?'text-xs':'text-lg font-bold shadow-md'} 
              ${activeTab === index ? 
                type?'bg-black text-blue-400 font-medium':'bg-primary shadow-sm' : 'hover:opacity-50  hover:bg-opacity-75 hover:shadow ' } ${liClass}`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="items-center lg:h-5/6 w-full">
        {props.tabs[activeTab].content}
      </div>
    </div>
  );
}
