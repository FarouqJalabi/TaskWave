class AddBackgroundUrlToBoards < ActiveRecord::Migration[7.1]
  def change
    add_column :boards, :background_url, :string, null: false
  end
end
