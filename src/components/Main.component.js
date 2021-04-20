import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


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
        {
            label: 5, 
            value: 5
        },
        {   
            label: 10,
            value: 10
        },
        {   label: 15,
            value: 15
        }   
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
        let updatedList = defaultResult
        updatedList = updatedList.filter(item => {
          return (
            item.value.toLowerCase().includes(e.target.value.toLowerCase())
          )
        })
        setState(prevState => {
            return({...prevState, result: updatedList })
        })      
    }
    
    const limetedResult = result.slice(offset, limit);

    return (
        <div>
            <form onSubmit={getResult}>
                <input type='text' name='input'></input>
                <button type='submit'>submit</button>
            </form>
            <input 
            type='text'
            onChange={filterList}
            >
            </input>
            <select value={defaultLimit} onChange={changeLimit}>
                {options.map((option) => (
                <option value={option.value}>{option.label}</option>
                ))}
          </select>
            <div> 
                {limetedResult.map(item => {
                    return (<li key={uuidv4()}>{item.value}</li>)
                })}
            </div>
            <button onClick={showNext}>Next</button>
            <button onClick={showPrev}>Revious</button>

            <p>Showing 1 to {defaultLimit} of {result.length} entrires</p>
        </div>
    )
}

export default MainComponent

