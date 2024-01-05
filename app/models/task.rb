class Task < ApplicationRecord
  validates_presence_of :name
  belongs_to :list
end
