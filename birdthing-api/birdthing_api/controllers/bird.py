from typing import List, Optional
from datetime import date

from pydantic import BaseModel

from sqlalchemy import select, Column, ForeignKey, Integer, String, Boolean, Date
from sqlalchemy.orm import Session, Mapped, relationship, selectinload

from starlite import Controller, HTTPException, get, post, Parameter
from starlite.status_codes import HTTP_404_NOT_FOUND

from birdthing_api import db

import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


class Bird(db.Base):
    __tablename__ = "bird"
    id: Mapped[int] = Column(Integer, primary_key=True)
    band_num: Mapped[str] = Column(String)
    owner_id: Mapped[int] = Column(Integer)
    male: Mapped[bool] = Column(Boolean)
    date_of_birth: Mapped[date] = Column(Date)
    date_of_death: Mapped[date] = Column(Date)
    nick: Mapped[str] = Column(String)
    notes: Mapped[str] = Column(String)
    father_id: Mapped[int] = Column(Integer, ForeignKey("bird.id"))
    mother_id: Mapped[int] = Column(Integer, ForeignKey("bird.id"))
    

CreateBirdDTO = db.dto_factory("CreateBirdDTO", Bird, exclude=["id"])

class BirdController(Controller):
    path = "api/birds"

    @post()
    def post_bird(
        self,
        data: CreateBirdDTO,
        db_session: Session
    ) -> Bird:
        bird: Bird = data.to_model_instance()
        db_session.add(bird)
        db_session.commit()
        return bird

    @get()
    def get_birds(
        self,
        db_session: Session,
        band_num: Optional[str],
        owner_id: Optional[int],
        male: Optional[bool],
        dob_from: Optional[date],
        dob_to: Optional[date],
        dod_from: Optional[date],
        dod_to: Optional[date],
        nick: Optional[str],
        father_id: Optional[int],
        mother_id: Optional[int],
        page: int = Parameter(default=0, ge=0),
        page_size: int = Parameter(default=10, gt=0, le=100),
    ) -> List[Bird]:
        stmt = select(Bird)

        if band_num is not None:
            stmt = stmt.where(Bird.band_num.icontains(band_num))
        if owner_id is not None:
            stmt = stmt.where(Bird.owner_id == owner_id)
        if male is not None:
            stmt = stmt.where(Bird.male == male)
        if dob_from is not None:
            stmt = stmt.where(Bird.date_of_birth >= dob_from)
        if dob_to is not None:
            stmt = stmt.where(Bird.date_of_birth <= dob_to)
        if dod_from is not None:
            stmt = stmt.where(Bird.date_of_death >= dod_from)
        if dod_to is not None:
            stmt = stmt.where(Bird.date_of_death <= dod_to)
        if nick is not None:
            stmt = stmt.where(Bird.nick.icontains(nick))
        if father_id is not None:
            stmt = stmt.where(Bird.father_id == father_id)
        if mother_id is not None:
            stmt = stmt.where(Bird.mother_id == mother_id)

        stmt = stmt.limit(page_size)
        stmt = stmt.offset(page * page_size)

        result = db_session.scalars(stmt)
        bird: List[Bird] = result.all()
        return bird
    
    @get(path="/{id:int}")
    def get_bird(self, id: int, db_session: Session) -> Bird:
        result = db_session.scalars(select(Bird).where(Bird.id == id))
        bird: Optional[Bird] = result.one_or_none()
        if not bird:
            raise HTTPException(
                detail=f"Bird with ID {id} not found",
                status_code=HTTP_404_NOT_FOUND)
        return bird
