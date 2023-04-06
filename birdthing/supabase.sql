create table bird (
  id bigint not null primary key,
  created_at timestamp default now(),
  band_num text,
  owner_id bigint,
  male boolean,
  date_of_birth date default now(),
  date_of_death date default now(),
  nick text,
  notes text,
  father_id bigint references bird (id),
  mother_id bigint references bird (id),
  updated_at timestamp default now() not null
);

create trigger handle_updated_at before update on bird 
  for each row execute procedure moddatetime (updated_at);


create or replace function ancestors(id int, depth int)
    returns table (
        id int,
        band_num text,
        nick text,
        father_id int,
        mother_id int,
        depth int)
as $$
    with recursive ancestors as (
        select
            id,
            band_num,
            nick,
            father_id,
            mother_id,
            0 as depth
        from bird
        where id = $1
        union
        select
            b.id,
            b.band_num,
            b.nick,
            b.father_id,
            b.mother_id,
            a.depth + 1 as depth
        from bird b
        inner join ancestors a
            on a.mother_id = b.id
            or a.father_id = b.id
        where a.depth < $2
    )
    select * from ancestors;
$$ language sql;

create or replace function children(id int)
    returns table (
        id int,
        band_num text,
        nick text,
        father_id int,
        mother_id int,
        depth int)
as $$
    with parent as (
        select
            b.male
        from bird b
        where b.id = $1
    )
    select
        b.id,
        b.band_num,
        b.nick,
        b.father_id,
        b.mother_id,
        1 as depth
    from bird b
    inner join parent p
        on (p.male and b.father_id = $1)
        or (not p.male and b.mother_id = $1);
$$ language sql;
