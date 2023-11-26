class Board < ApplicationRecord
  validates_presence_of :name
  validates_presence_of :public
  # ? Active record using those values?
  # enum :status, [:public, :private ]

  belongs_to :creator, :class_name => 'User', dependent: :destroy
  has_many :lists, dependent: :destroy
end
