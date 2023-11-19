class CreateBoards < ActiveRecord::Migration[7.1]
  def change
    create_table :boards do |t|
      t.string :name
      t.references :creator, null: false, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
