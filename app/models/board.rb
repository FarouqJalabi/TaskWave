class Board < ApplicationRecord
  # Validations
  validates_presence_of :name
  #* False don't satisfy presence_of
  # validates_presence_of :public
  validates_inclusion_of :public,  in: [true, false]

  validates_presence_of :background_url
  # https://github.com/rails/rails/pull/49769#issuecomment-1777833124
  attribute :background_url
  # key is url, value is alt text
  enum background_url: {
    "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":"An image of big ben",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":"Dark green forest with fog",
    "https://images.unsplash.com/photo-1630839437035-dac17da580d0?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":"Huge orange and white planet",
    "https://images.unsplash.com/photo-1682686581362-796145f0e123?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":"Shara with some mountains in background",

  }

  # Relations
  belongs_to :creator, :class_name => 'User'
  has_many :lists, dependent: :destroy
end
