"""added creation_date and creation_datetime columns to user model

Revision ID: af6285be2be9
Revises: 245547093a73
Create Date: 2024-04-27 23:25:20.785047

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'af6285be2be9'
down_revision = '245547093a73'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('creation_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('creation_datetime', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('creation_datetime')
        batch_op.drop_column('creation_date')

    # ### end Alembic commands ###
