from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import declarative_base

from starlite import DTOFactory
from starlite.plugins.sql_alchemy import SQLAlchemyConfig, SQLAlchemyPlugin, SQLAlchemySessionConfig

Base = declarative_base()
sqla_config = SQLAlchemyConfig(
    connection_string="postgresql+psycopg2://postgres:Joebob123@localhost/birdthing",
    use_async_engine=False
)
sqla_plugin = SQLAlchemyPlugin(config=sqla_config)
dto_factory = DTOFactory(plugins=[sqla_plugin])