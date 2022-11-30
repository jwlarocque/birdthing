### Resume

Anywhere:  
`docker start birdthing-postgres`  

In `birdthing`:  
`uvicorn birdthing_api.main:app --reload`  

In `birdthing/birdthing`:  
`npm run dev -- --open`

### DB

`docker pull postgres`

`docker run --name birdthing-postgres -e POSTGRES_PASSWORD=Joebob123 -p 5432:5432 -d postgres`

Run `db.sql`, `tables/*.sql` in `db/`

# TODO

* svelte-select isCreatable - create new birds if parent doesn't exist
    * warn user
* svelte-select - find some way to search as soon as input is focused
* editing
* edit (/new) validation
    * use Felte
    * unique band numbers
    * dob < dod
    * parent sexes
* search/datagrid filters
