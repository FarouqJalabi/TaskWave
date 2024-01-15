class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :boards, :foreign_key => "creator_id"

  after_create :create_starter_board

  def create_starter_board
    board = self.boards.create(name:"Starter board", background_url: Board::background_urls.keys[1])
    list_names = ["Todo", "Doing", "Done", "Drag me to trash!"]
    task_names = [["Drag me around", "Double click to edit!"],
                  ["Drag me to trash!", "Task"],
                  ["Drag me to change place!", "Task", "Task", "Task"],
                  ["Click on trash icon to delete board!"]]
    list_names.each_with_index do |list_name, list_index|
      list = board.lists.create(name:list_name,place: list_index)
      task_names[list_index]&.each_with_index do |task, index|
        list.tasks.create(name: task, place:index)
      end
    end
  end
end
