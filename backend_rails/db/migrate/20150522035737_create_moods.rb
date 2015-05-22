class CreateMoods < ActiveRecord::Migration
  def change
    create_table :moods do |t|
      t.integer :level
      t.string :comment

      t.timestamps null: false
    end
  end
end
