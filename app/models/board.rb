class Board < ApplicationRecord
  validates_presence_of :name

  belongs_to :creator, :class_name => 'User', dependent: :destroy
  has_many :lists, dependent: :destroy
end
