import React, {useState} from 'react'
import './search.css'

export const Search = () => {

    const [search, setSearch] = useState('')

    const handleChange = e => {
        setSearch(e.target.value)
    }

    return (
        <div class="search">
            <input 
                id="search"
                type="text"
                onChange={handleChange}
                placeholder="Search elements ..."
                value={search}
                autoFocus
            />
            <i class="fas fa-search"></i>
        </div>
        
    )
}
