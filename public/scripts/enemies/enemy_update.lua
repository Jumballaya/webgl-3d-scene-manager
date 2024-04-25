function update(entity)
  transform = get_transform(entity)

  if (transform) then
    transform.translation = { transform.translation[1], transform.translation[2],  transform.translation[3] + 0.01 }
  end
  if transform.translation[3] > 50 then
    delete_entity(entity)
  end
end

return update