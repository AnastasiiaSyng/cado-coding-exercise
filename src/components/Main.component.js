import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Main.styles.css'


const MainComponent = () => {

    const [state, setState] = useState({
        domain: '',
        result: [],
        defaultResult: [],
        limit: 10,
        offset: 0,
        defaultLimit: 10
    })

    const options = [
        {value: 5},
        {value: 10},
        {value: 15}   
    ]

    let { result, limit, offset, defaultLimit, defaultResult } = state;

    const getResult = (e) => {
        e.preventDefault();
        const domain = e.target.elements.input.value;
    
        if (domain) {
            fetch(`https://otx.alienvault.com/otxapi/indicator/domain/whois/${domain}`)
            .then(response => response.json())
            .then(response => {                
                setState(prevState => {
                    return ({...prevState, 
                    domain: domain,
                    result: response.data,
                    defaultResult: response.data});
                })
            })
        }
    }
    const showNext = () => {
        if ((limit > result.length) && ((limit - result.length) < (defaultLimit))) {
            return;
        } else {
            setState(prevState => {
                return({...prevState,offset: limit, limit: limit + defaultLimit })
            })
        }
    }
    const showPrev = () => {
        if (offset <= 0) return; 
        setState(prevState => {
            return({...prevState,offset: offset - defaultLimit, limit: limit - defaultLimit })
        })
    }
    const changeLimit = (e) => {
        setState(prevState => {
            return({...prevState, limit: Number(e.target.value), defaultLimit: Number(e.target.value)  })
        })
    }
    const filterList = (e) => {
        const updatedList = defaultResult.filter(item => {
          return (
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        })
        setState(prevState => {
            return({...prevState, result: updatedList })
        })      
    }
    
    const limetedResult = result.slice(offset, limit);

    return (
        <div className='container'>
            <div className='input_container'>
                <form onSubmit={getResult}>
                    <input type='text' name='input'></input>
                    <button type='submit'>submit</button>
                </form>
                <div>
                <span>Show</span> <select value={defaultLimit} onChange={changeLimit}>
                    {options.map((option) => (
                    <option value={option.value}>{option.value}</option>
                    ))}
                </select><span>entries</span><span>  </span>
                <input 
                    placeholder='search'
                    type='text'
                    onChange={filterList}
                />
                </div>
            </div>
            <div> 
                <div className='table_name'>
                    <p>RECORD</p>
                    <p>VALUE</p>
                </div>
                {limetedResult.map(item => {
                    return (<div key={uuidv4()} className='result_container'>
                                <div>{item.name}</div>
                                <div>{item.value}</div>
                            </div>)
                })}
            </div>
            <div className='scroll_container'>
                <p>Showing 1 to {defaultLimit} of {result.length} entrires</p>
                <div>
                    <button onClick={showPrev}>Revious</button>
                    <button onClick={showNext}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default MainComponent

