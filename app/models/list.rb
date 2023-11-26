class List < ApplicationRecord
  validates_presence_of :name

  belongs_to :board
  has_many :tasks, dependent: :destroy
end
