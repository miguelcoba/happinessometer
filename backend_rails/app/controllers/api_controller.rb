class ApiController < ApplicationController
  def login
  end

  def logout
  end

  def mood
    mood_sum = Mood.all.map {|m| m.level}.inject(:+)
    average = mood_sum.to_f / Mood.count

    respond_to do |format|
      format.html { render json: {average_mood: average} }
      format.json { render json: {average_mood: average} }
    end
  end
end
