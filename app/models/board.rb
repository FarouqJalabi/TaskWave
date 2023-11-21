class Board < ApplicationRecord
  # belongs_to :creator, :class_name => 'User', :foreign_key => 'creator_id'
  belongs_to :creator, :class_name => 'User', dependent: :destroy
  has_many :lists, dependent: :destroy
end
