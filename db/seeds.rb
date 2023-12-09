# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


# Users
User.find_or_create_by!(email: "Test@gmail.com") do |user|
  user.password = "Test1234"
  user.password_confirmation = "Test1234"
end
User.find_or_create_by!(email: "Farouqjalabi@gmail.com") do |user|
  user.password = "Test1234"
  user.password_confirmation = "Test1234"
end

#boards
board_names = ["AgileHub", "Flappy bird", "GTA VI", "CyberTruck"]
list_names = ["Design", "Code", "Preview", "Polished"]
task_names = [
  "Update Profile",
  "Drag-and-Drop",
  "Fix Design",
  "Test Authentication",
  "Optimize Queries",
  "Create Widget",
  "Refactor Code",
  "Dark Mode",
  "Usability Testing",
  "Email Notifications",
  "Update Documentation",
  "Third-Party Integration",
  "Browser Debugging",
  "User Feedback",
  "New Landing Page"
]

board_names.each do |board_name|
  board = User.first.boards.find_or_create_by!(name: board_name, background_url: Board::background_urls.keys.sample)

  list_names.each do |list_name|
    list = board.lists.create(name:list_name)
    (1..rand(2..10)).each do |num|
      list.tasks.create(name: task_names.sample)
    end
  end
end

User.first.boards.find_or_create_by!(name: "Private board", background_url: Board::background_urls.keys.sample, public: false)
User.second.boards.find_or_create_by!(name: "Private board", background_url: Board::background_urls.keys.sample, public: false)

