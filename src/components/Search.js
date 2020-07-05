import React, {useState} from 'react'

export const Search = () => {

    const [search, setSearch] = useState('')

    const handleChange = e => {
        setSearch(e.target.value)
    }

    return (
        <input 
            type="text"
            onChange={handleChange}
            placeholder="Search elements ..."
            value={search}
            autoFocus
        />
    )
}
